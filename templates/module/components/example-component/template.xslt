<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns="http://www.w3.org/1999/xhtml" 
                version="1.0">
    
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <!-- Replace 'ck-custom-component' with your own CSS class -->
        <div class="ck-custom-component">
            
            <!-- Where child nodes will be injected -->
            <ck-children/>
            
        </div>
    </xsl:template>
    
</xsl:stylesheet>